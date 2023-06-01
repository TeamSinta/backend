interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly VITE_AUTH_CALLBACK_URL: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_GOOGLE_OAUTH_CALLBACK_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
