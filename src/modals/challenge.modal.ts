import { Schema, model, models } from "mongoose";

const challengeSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref:"User"
      },
      challenge: {
        type: Map,
        of: Schema.Types.Mixed,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now,
        // expires: 300 // The document will be automatically deleted after 300 seconds (5 minutes)
      }
})

const Challenge = models.Challenge || model("Challenge", challengeSchema)

export default Challenge