interface HajarConfigParameters {
    accessKeyId: string
    secretAccessKey: string
    Bucket: string
    firebaseConfig: string
    OOBCODE: string
    mongodb_name: string
    mongodb_user: string
    mongodb_password: string
    mongodb_options: any
  }
  export default function updateOptions (options: HajarConfigParameters): void {
    globalThis._config = options;
  }