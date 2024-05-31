export const ConfigProvider = {
  getOrThrow(key: string): string {
    const value = process.env[key];

    if (value === undefined) {
      throw new Error(`Configuration key "${key}" does not exist`);
    }

    return value;
  },
};
