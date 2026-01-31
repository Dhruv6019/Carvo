import { PreviewService } from "../PreviewService";

describe("PreviewService", () => {
    it("should generate a preview URL", () => {
        const config = { color: "red", wheels: "alloy" };
        const url = PreviewService.generatePreview(config);
        expect(url).toContain("mock-preview.com");
        expect(url).toContain(encodeURIComponent(JSON.stringify(config)));
    });
});
