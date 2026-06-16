import { recoveryService} from "./recovery.service";
import { RECOVERY_CONFIG } from "./recovery.config";
import { loggingService } from "../logging/logging.service";
import { LOG_COMPONENTS } from "../logging/logging.constants";

export class RecoveryScheduler {
    private timer?: NodeJS.Timeout | undefined;

    start(): void {
        if(this.timer) return;  // Already running
        loggingService.info(LOG_COMPONENTS.RECOVERY, 'Recovery Scheduler Started', {intervalMs: RECOVERY_CONFIG.INTERVAL_MS});
        this.timer = setInterval(async () => {
            try {
                await recoveryService.recover();
            }
            catch(error){
               loggingService.error(LOG_COMPONENTS.RECOVERY, 'Recovery Run Failed', {error: error instanceof Error ? error.message: 'Unknown error'}); 
            }
        }, RECOVERY_CONFIG.INTERVAL_MS);
    
    };

    stop(): void {
        if(!this.timer) return;  // Not running
        clearInterval(this.timer);
        this.timer = undefined;
        loggingService.info(LOG_COMPONENTS.RECOVERY, 'Recovery Scheduler Stopped');
    };
};

export const recoveryScheduler = new RecoveryScheduler();
