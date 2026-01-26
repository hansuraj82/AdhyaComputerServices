// models/policy.model.js
import mongoose from "mongoose";

const policySchema = new mongoose.Schema(
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

        policyNumber: {
            type: String,
            required: true,
            trim: true
        },

        policyStartDate: {
            type: Date,
            required: true
        },

        policyEndDate: {
            type: Date,
            required: true
        },

        archived: {
            type: Boolean,
            default: false
        },

        notificationAcknowledgedUntil: {
            type: Date,
            default: null
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

export default mongoose.model("PolicyService", policySchema);
