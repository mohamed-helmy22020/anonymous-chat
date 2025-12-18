import mongoose from "mongoose";

export interface MessageType extends mongoose.Document {
    roomId: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    text: string;
    createdAt: Date;
    updatedAt: Date;
    getData: () => any;
}

const messageSchema = new mongoose.Schema(
    {
        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: [true, "Please provide room id"],
        },
        sender: {
            type: String,
            required: [true, "Please provide sender user"],
        },

        text: {
            type: String,
            required: false,
        },
        expiresAt: Date,
    },
    {
        timestamps: true,
    }
);

messageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

messageSchema.methods.getData = function () {
    return {
        id: this._id,
        roomId: this.roomId,
        sender: this.sender,
        text: this.text,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    };
};
export default mongoose.model<MessageType & Document>("Message", messageSchema);
