import { createStore, combineReducers, applyMiddleware } from "redux";
import authreducer from "./auth/reducer";
import adminreducer from "./admin/reducer";
import dokterreducer from "./dokter/reducer";
import pasienreducer from "./pasien/reducer";
import biayareducer from "./biaya/reducer";
import jadwalreducer from "./jadwal/reducer";
import chatreducer from "./chat/reducer";
import detailjadwalreducer from "./detailjadwal/reducer";
import logger from "redux-logger";
export default createStore(
  combineReducers({
    auth: authreducer,
    admin: adminreducer,
    dokter: dokterreducer,
    pasien: pasienreducer,
    biaya: biayareducer,
    jadwal: jadwalreducer,
    detailjadwal: detailjadwalreducer,
    chat: chatreducer
  }),
  {},
  applyMiddleware(logger)
);
