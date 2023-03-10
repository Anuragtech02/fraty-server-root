import mongoose from "mongoose";
const Schema = mongoose.Schema;

const DiscordSchema = new Schema({
    wallet: {
        type: String,
        unique: true,
        required: true,
        default: "false",
    },
    username: {
        type: String,
        default: false,
    },
    refreshToken: {
        type: String,
        default: false,
    },
    accessToken: {
        type: String,
        default: false,
    },
    discord_id: {
        type: String,
        default: false,
    },
    redirect: {
        type: String,
        default: false,
    },
},{
    timestamps: true,
});

const Discord = mongoose.model("Discord", DiscordSchema);
export default Discord;