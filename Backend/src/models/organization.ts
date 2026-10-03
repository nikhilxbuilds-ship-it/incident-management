import mongoose, {  Schema, Document } from "mongoose";

interface IOrganization extends Document {
    name : string,
    slug : string,
    createdAt : Date
}

const organizationSchema = new Schema<IOrganization>(
    {
        name : {
            type: String,
            required : true,
            trim : true
        },
        slug : {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true,
        },  
    },
    {
        timestamps : true,
    }
);

const Organization = mongoose.model<IOrganization>(
  "Organization",
  organizationSchema
);

export default Organization;