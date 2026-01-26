// models/gst.model.js
import mongoose from "mongoose";
import { encrypt } from "../utils/encrypt.js";

const gstSchema = new mongoose.Schema(
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

        gstNumber: {
            type: String,
            required: true,
            uppercase: true,
            trim: true
        },

        gstId: {
            type: String,
            required: true,
        },
        gstPassword: {
            type: String,
            required: true,
        },

        filingFrequency: {
            type: String,
            enum: ["MONTHLY", "QUARTERLY", "YEARLY"],
            required: true
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

gstSchema.pre("save", function () {
    if (this.isModified("gstId")) {
        this.gstId = encrypt(this.gstId);
    }

    if (this.isModified("gstPassword")) {
        this.gstPassword = encrypt(this.gstPassword);
    }
});

export default mongoose.model("GSTService", gstSchema);
