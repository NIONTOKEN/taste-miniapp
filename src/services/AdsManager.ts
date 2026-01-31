
export interface AdResult {
    done: boolean;
    description: string;
    state: 'load' | 'render' | 'dismiss' | 'error';
    error?: boolean;
}

export class AdsManager {
    private static blockId = "22088"; // Adsgram verified Block ID

    static async showRewardedVideo(): Promise<boolean> {
        return new Promise((resolve) => {
            const windowAny = window as any;
            if (!windowAny.Adsgram) {
                console.error("Adsgram SDK not loaded");
                resolve(false);
                return;
            }

            const AdController = windowAny.Adsgram.init({ blockId: this.blockId });

            AdController.show().then((result: AdResult) => {
                if (result.done) {
                    console.log("Ad completed successfully");
                    resolve(true);
                } else {
                    console.log("Ad dismissed or failed");
                    resolve(false);
                }
            }).catch((error: any) => {
                console.error("Ad error:", error);
                resolve(false);
            });
        });
    }
}
