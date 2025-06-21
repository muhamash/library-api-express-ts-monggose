export const isZodError = ( error: any ): error is { issues: any[] } =>
{
    return error && typeof error === "object" && "issues" in error && Array.isArray( error.issues );
};