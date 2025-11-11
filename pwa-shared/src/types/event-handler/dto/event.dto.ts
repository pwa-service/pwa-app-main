import {LeadDto} from "./lead.dto";
import {PurchaseDto} from "./purchase.dto";
import {CompleteRegistrationDto} from "./complete-registration.dto";
import {SubscribeDto} from "./subscribe.dto";

export type FbEventDto = LeadDto | PurchaseDto | CompleteRegistrationDto | SubscribeDto