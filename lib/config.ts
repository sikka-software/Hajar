type HajarConfigParameters = {
    accessKeyId: string,
    secretAccessKey: string,
    Bucket: string,
    firebaseConfig: string,
    OOBCODE: string
};
export default function updateOptions(options: HajarConfigParameters) {
    globalThis.__config = options;
}