variable "aws_region" {
    description = "The AWS region to create resources in"
    default = "ap-south-1"
    type = string 
}

variable "bucket_prefix" {
    description = "Prefix for the s3 bucket name."
    type = string
    default = "my-static-bucket"
}