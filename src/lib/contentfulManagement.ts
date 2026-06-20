import {createClient} from "contentful-management";
import {
    CONTENTFUL_DEFAULT_ENVIRONMENT,
    CONTENTFUL_DEFAULT_LOCALE,
    CONTENTFUL_ENVIRONMENT_ENV,
    CONTENTFUL_MANAGEMENT_TOKEN_ENV,
    CONTENTFUL_MISSING_ENV_MESSAGES,
    CONTENTFUL_PRODUCT_CONTENT_TYPE,
    CONTENTFUL_PRODUCT_FIELD_IDS,
    CONTENTFUL_SPACE_ID_ENV,
} from "@/constants/contentful";
import type {CreateProductInput, CreateProductResult} from "@/types/createProduct";
import type {DeleteProductResult} from "@/types/deleteProduct";
import type {UpdateProductInput, UpdateProductResult} from "@/types/updateProduct";

const getRequiredEnv = (name: string) => {
    const value = process.env[name];

    if (!value) {
        throw new Error(CONTENTFUL_MISSING_ENV_MESSAGES[name] ?? `Missing required environment variable: ${name}`);
    }

    return value;
};

const getContentfulEnvironmentId = () => {
    return process.env[CONTENTFUL_ENVIRONMENT_ENV] ?? CONTENTFUL_DEFAULT_ENVIRONMENT;
};

const getContentfulManagementEnvironment = async () => {
    const client = createClient({accessToken: getRequiredEnv(CONTENTFUL_MANAGEMENT_TOKEN_ENV)}, {type: "legacy"});
    const space = await client.getSpace(getRequiredEnv(CONTENTFUL_SPACE_ID_ENV));

    return space.getEnvironment(getContentfulEnvironmentId());
};

type ContentfulManagementEnvironment = Awaited<ReturnType<typeof getContentfulManagementEnvironment>>;

const getLocalizedField = (value: unknown) => {
    return {
        [CONTENTFUL_DEFAULT_LOCALE]: value,
    };
};

const getLocalizedStringField = (value: string) => {
    return {
        [CONTENTFUL_DEFAULT_LOCALE]: value,
    };
};

const createProductAsset = async (
    environment: ContentfulManagementEnvironment,
    input: CreateProductInput | UpdateProductInput,
    image: File,
) => {
    const asset = await environment.createAssetFromFiles({
        fields: {
            title: getLocalizedStringField(input.name),
            description: getLocalizedStringField(input.description),
            file: {
                [CONTENTFUL_DEFAULT_LOCALE]: {
                    contentType: image.type,
                    fileName: image.name,
                    file: await image.arrayBuffer(),
                },
            },
        },
    });
    const processedAsset = await asset.processForLocale(CONTENTFUL_DEFAULT_LOCALE);

    return processedAsset.publish();
};

const createProductAssets = async (
    environment: ContentfulManagementEnvironment,
    input: CreateProductInput | UpdateProductInput,
) => {
    const images = input.images ?? [];

    return Promise.all(images.map(image => createProductAsset(environment, input, image)));
};

const getAssetLinksField = (assets: Awaited<ReturnType<typeof createProductAssets>>) => {
    return getLocalizedField(assets.map(asset => ({
        sys: {
            type: "Link",
            linkType: "Asset",
            id: asset.sys.id,
        },
    })));
};

const getAssetLinks = (assets: Awaited<ReturnType<typeof createProductAssets>>) => {
    return assets.map(asset => ({
        sys: {
            type: "Link",
            linkType: "Asset",
            id: asset.sys.id,
        },
    }));
};

const isAssetLink = (value: unknown): value is {sys: {type: string; linkType: string; id: string}} => {
    if (!value || typeof value !== "object" || !("sys" in value)) return false;

    const sys = value.sys;

    return Boolean(
        sys
        && typeof sys === "object"
        && "type" in sys
        && "linkType" in sys
        && "id" in sys
        && sys.type === "Link"
        && sys.linkType === "Asset"
        && typeof sys.id === "string",
    );
};

const getExistingAssetLinks = (entry: Awaited<ReturnType<ContentfulManagementEnvironment["getEntry"]>>) => {
    const value = entry.fields[CONTENTFUL_PRODUCT_FIELD_IDS.images]?.[CONTENTFUL_DEFAULT_LOCALE];

    if (!Array.isArray(value)) return [];

    return value.filter(isAssetLink);
};

const getAssetFileUrl = async (environment: ContentfulManagementEnvironment, assetId: string) => {
    const asset = await environment.getAsset(assetId);
    const fileUrl = asset.fields.file?.[CONTENTFUL_DEFAULT_LOCALE]?.url;

    if (typeof fileUrl !== "string") return null;

    return fileUrl.startsWith("//") ? `https:${fileUrl}` : fileUrl;
};

const normalizeImageUrl = (url: string) => {
    if (url.startsWith("//")) return `https:${url}`;

    return url;
};

const filterAssetLinksByKeptUrls = async (
    environment: ContentfulManagementEnvironment,
    links: ReturnType<typeof getExistingAssetLinks>,
    keptImageUrls?: string[],
) => {
    if (!keptImageUrls) return links;

    const keptUrlSet = new Set(keptImageUrls.map(normalizeImageUrl));

    const linksWithAssetUrls = await Promise.all(links.map(async link => ({
        link,
        assetUrl: await getAssetFileUrl(environment, link.sys.id),
    })));

    return linksWithAssetUrls
        .filter(({assetUrl}) => assetUrl && keptUrlSet.has(normalizeImageUrl(assetUrl)))
        .map(({link}) => link);
};

const getCurrentAssetLinksForUpdate = async (
    environment: ContentfulManagementEnvironment,
    entry: Awaited<ReturnType<ContentfulManagementEnvironment["getEntry"]>>,
    keptImageUrls?: string[],
) => {
    return filterAssetLinksByKeptUrls(environment, getExistingAssetLinks(entry), keptImageUrls);
};

const mergeAssetLinks = (
    currentLinks: ReturnType<typeof getExistingAssetLinks>,
    nextLinks: ReturnType<typeof getAssetLinks>,
) => {
    const seenIds = new Set<string>();

    return [...currentLinks, ...nextLinks].filter(link => {
        if (seenIds.has(link.sys.id)) return false;

        seenIds.add(link.sys.id);
        return true;
    });
};

const isPublishedEntry = (entry: Awaited<ReturnType<ContentfulManagementEnvironment["getEntry"]>>) => {
    return typeof entry.sys.publishedVersion === "number";
};

const getDeletableProductEntry = async (
    entry: Awaited<ReturnType<ContentfulManagementEnvironment["getEntry"]>>,
) => {
    if (isPublishedEntry(entry)) {
        return entry.unpublish();
    }

    return entry;
};

export const createContentfulProduct = async (input: CreateProductInput): Promise<CreateProductResult> => {
    const environment = await getContentfulManagementEnvironment();
    const assets = await createProductAssets(environment, input);
    const fields: Record<string, Record<string, unknown>> = {
        [CONTENTFUL_PRODUCT_FIELD_IDS.name]: getLocalizedField(input.name),
        [CONTENTFUL_PRODUCT_FIELD_IDS.description]: getLocalizedField(input.description),
        [CONTENTFUL_PRODUCT_FIELD_IDS.price]: getLocalizedField(input.price),
        [CONTENTFUL_PRODUCT_FIELD_IDS.category]: getLocalizedField(input.categories),
    };

    if (assets.length) {
        fields[CONTENTFUL_PRODUCT_FIELD_IDS.images] = getAssetLinksField(assets);
    }

    const entry = await environment.createEntry(CONTENTFUL_PRODUCT_CONTENT_TYPE, {fields});
    const publishedEntry = await entry.publish();

    return {
        id: publishedEntry.sys.id,
        assetIds: assets.map(asset => asset.sys.id),
    };
};

export const deleteContentfulProduct = async (id: string): Promise<DeleteProductResult> => {
    const environment = await getContentfulManagementEnvironment();
    const entry = await environment.getEntry(id);
    const deletableEntry = await getDeletableProductEntry(entry);

    await deletableEntry.delete();

    return {id};
};

export const updateContentfulProduct = async (input: UpdateProductInput): Promise<UpdateProductResult> => {
    const environment = await getContentfulManagementEnvironment();
    const entry = await environment.getEntry(input.id);
    const assets = await createProductAssets(environment, input);
    const keptAssetLinks = await getCurrentAssetLinksForUpdate(environment, entry, input.keptImageUrls);

    entry.fields[CONTENTFUL_PRODUCT_FIELD_IDS.name] = getLocalizedField(input.name);
    entry.fields[CONTENTFUL_PRODUCT_FIELD_IDS.description] = getLocalizedField(input.description);
    entry.fields[CONTENTFUL_PRODUCT_FIELD_IDS.price] = getLocalizedField(input.price);
    entry.fields[CONTENTFUL_PRODUCT_FIELD_IDS.category] = getLocalizedField(input.categories);

    if (assets.length) {
        entry.fields[CONTENTFUL_PRODUCT_FIELD_IDS.images] = getLocalizedField(
            mergeAssetLinks(
                keptAssetLinks,
                getAssetLinks(assets),
            ),
        );
    } else if (input.keptImageUrls) {
        entry.fields[CONTENTFUL_PRODUCT_FIELD_IDS.images] = getLocalizedField(keptAssetLinks);
    }

    const updatedEntry = await entry.update();
    const publishedEntry = await updatedEntry.publish();

    return {
        id: publishedEntry.sys.id,
        assetIds: assets.map(asset => asset.sys.id),
    };
};
