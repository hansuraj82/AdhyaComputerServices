// models/itr.model.js
import mongoose from "mongoose";
import { encrypt } from "../utils/encrypt.js";

const itrSchema = new mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        },

        brokerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Broker",
            default: null
        },

        panEncrypted: {
            type: String,
            required: true
        },

        panLast4: {
            type: String
        },

        itrPassword: {
            type: String,
            required: true // encrypt later
        },

        documents: [
            {
                label: String,
                url: String,
                publicId: String,
                resourceType: {
                    type: String,
                    enum: ["image", "raw"],
                    required: true,
                },
                uploadedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    { timestamps: true }
);

itrSchema.pre("save", function () {
    if (this.isModified("panEncrypted")) {
        this.panEncrypted = encrypt(this.panEncrypted);
    }

    if (this.isModified("itrPassword")) {
        this.itrPassword = encrypt(this.itrPassword);
    }
});



export default mongoose.model("ITRService", itrSchema);
