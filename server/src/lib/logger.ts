// Simple console-based logger (Winston dependency removed)

export const logError = (
  message: string,
  error?: Error | unknown,
  meta?: any,
) => {
  console.error(`🔴 [ERROR] ${message}`, error ?? "", meta ?? "");
};

export const logInfo = (message: string, meta?: any) => {
  console.log(`ℹ️ [INFO] ${message}`, meta ?? "");
};

export const logWarn = (message: string, meta?: any) => {
  console.warn(`⚠️ [WARN] ${message}`, meta ?? "");
};

export const logDebug = (message: string, meta?: any) => {
  console.debug(`🐛 [DEBUG] ${message}`, meta ?? "");
};

export const logHttp = (message: string, meta?: any) => {
  console.log(`🌐 [HTTP] ${message}`, meta ?? "");
};

export const logger = {
  error: (message: string, ...args: any[]) => console.error(`🔴 ${message}`, ...args),
  info: (message: string, ...args: any[]) => console.log(`ℹ️ ${message}`, ...args),
  warn: (message: string, ...args: any[]) => console.warn(`⚠️ ${message}`, ...args),
  debug: (message: string, ...args: any[]) => console.debug(`🐛 ${message}`, ...args),
  http: (message: string, ...args: any[]) => console.log(`🌐 ${message}`, ...args),
};

export default logger;
