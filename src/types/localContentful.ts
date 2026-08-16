export interface FixtureComponent {
    entryId: string;
    type: [string];
    config: unknown;
    references?: string[];
}

export interface LocalEntry {
    sys: { id: string };
    fields: {
        type: [string];
        config: unknown;
        references?: LocalEntry[];
    };
}

export interface LocalPage {
    sys: { id: string };
    fields: {
        name: string;
        references: LocalEntry[];
    };
}

export interface FixtureShape {
    page: {
        name: string;
        references: string[];
    };
    pageComponents: FixtureComponent[];
}
