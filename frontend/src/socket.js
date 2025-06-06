import {io} from "socket.io-client"
import { CORS_ORIGIN } from "./const"

const socket = io(`${CORS_ORIGIN}`)

export {socket}