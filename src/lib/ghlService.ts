export class HighLevel {
  private clientId: string;
  private clientSecret: string;

  constructor(config: { clientId: string; clientSecret: string }) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
  }

  public medias = {
    uploadMediaContent: async (params: { file: File; name: string; hosted: boolean }) => {
      const formData = new FormData();
      formData.append("file", params.file);
      formData.append("name", params.name);
      formData.append("hosted", params.hosted.toString());

      try {
        // The user provided a 'pit-' token which is likely a Personal Access Token (PAT). test
        // Standard GHL OAuth uses Bearer tokens. 
        // We will try to use the provided secret as the Authorization header.
        const response = await fetch("https://services.leadconnectorhq.com/medias/upload-file", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.clientSecret}`, 
                "Version": "2021-07-28"
            },
            body: formData
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error("GHL Upload Error:", response.status, errorText);
            throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error("GHL Upload Exception:", error);
        throw error;
      }
    }
  };
}
