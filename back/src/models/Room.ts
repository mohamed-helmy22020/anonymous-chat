import mongoose from "mongoose";

export interface RoomType extends mongoose.Document {
    participants: String[];
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date;
    getData: () => any;
}
export const roomTtl = 60 * 10;

const roomSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: String,
            },
        ],
        expiresAt: Date,
    },
    {
        timestamps: true,
    }
);
roomSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
roomSchema.methods.getData = function () {
    return {
        id: this._id,
        participants: this.participants,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    };
};
export default mongoose.model<RoomType & Document>("Room", roomSchema);
