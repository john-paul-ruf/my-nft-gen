import {execFile} from "child_process";
import {RequestNewWorkerThread} from "../core/worker-threads/RequestNewWorkerThread.js";

export const ResumeProject = async (filename) => {
    RequestNewWorkerThread(filename);
};