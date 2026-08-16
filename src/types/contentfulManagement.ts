import type {createClient} from "contentful-management";

type ContentfulManagementClient = ReturnType<typeof createClient>;
type ContentfulManagementSpace = Awaited<ReturnType<ContentfulManagementClient["getSpace"]>>;

export type ContentfulManagementEnvironment = Awaited<ReturnType<ContentfulManagementSpace["getEnvironment"]>>;
