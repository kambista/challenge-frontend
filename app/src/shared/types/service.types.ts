export type ServiceError = {
  title: string;
  message: string;
  name: "DUPLICATE_DNI" | "INVALID_PHONE" | "SERVER_ERROR";
};

export type ServiceResult =
  { success: true } | { success: false; data: ServiceError };
