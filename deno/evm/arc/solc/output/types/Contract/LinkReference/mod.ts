export type ByteOffset = Readonly<{
    start: number;
    length: number;
}>;
declare const [byteOffsets, library]: Array<readonly ByteOffset[]>
export type ByteOffsets = typeof byteOffsets;

export type Library = typeof library;
declare const [libraries, source]: Array<Record<string, Library>>
export type Libraries = typeof libraries;

export type Source = typeof source;
declare const [sources, linkReferences]: Array<Record<string, Source>>
export type Sources = typeof sources;

export type LinkReferences = typeof linkReferences;