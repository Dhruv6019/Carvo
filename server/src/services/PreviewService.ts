export class PreviewService {
    static generatePreview(configuration: any): string {
        // Mock preview generation
        // In a real app, this would call a 2D/3D rendering engine
        return `https://mock-preview.com/render?config=${encodeURIComponent(JSON.stringify(configuration))}`;
    }
}
