import Request from '../models/requestModel.js';
import User from "../models/userModel.js";
import nodemailer from "nodemailer";
import React from "react";
import { renderToString } from "react-dom/server";
import { getRejectionEmailHTML } from "../../frontend/src/components/emails/RejectionEmail.js";
import dotenv from 'dotenv';
dotenv.config();

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Get only verified requests
export const getVerifiedRequests = async (req, res) => {
  try {
    // Get logged-in user's branch_location
    const userBranch = req.user?.branch_location;

    if (!userBranch) {
      return res.status(400).json({ message: "Branch location missing from token" });
    }

    // Fetch only verified requests that match the branch location
    const verifiedRequests = await Request.find({
      verify: "Verified",
      $or: [{ inLocation: userBranch }, { outLocation: userBranch }],
    });
    
    res.status(200).json(verifiedRequests);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching verified requests', error: err });
  }
};


// Get dispatch item bt Id
export const getDispatchById = async(req, res) => {
  const {id} = req.params;

  try{
    const request = await Request.findById(id);
    if(!request){
      return res.status(404).json({message: "Dispatch item not found"});
    }
    res.status(200).json(request);
  }catch(err){
    res.status(500).json({ message: 'Error fetching request', error: err });
  }
};

// update dispatch status
export const updateDispatchStatusOut = async (req, res) => {
  const { id } = req.params;
  const { dispatchStatusOut, approverNameOut, serviceNoOut, commentOut } = req.body;

  // Validation
  if (!approverNameOut || !serviceNoOut) {
    return res.status(400).json({ message: "Name and Service Number are required!" });
  }
  if (dispatchStatusOut === "Rejected" && !commentOut) {
    return res.status(400).json({ message: "Comment is required for rejection!" });
  }

  try {
    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Find sender email using service_no
    const sender = await User.findOne({ service_no: request.service_no });
    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }

    request.dispatchStatusOut = dispatchStatusOut;
    request.approverNameOut = approverNameOut;
    request.serviceNoOut = serviceNoOut;
    request.commentOut = commentOut || ""; 

    await request.save();

    if (dispatchStatusOut === "Rejected") {

      const emailHtml = getRejectionEmailHTML({
        senderName: request.sender_name,
        itemDetails: request.items,
        comment: commentOut,
      });

      // Send Email
      await transporter.sendMail({
        from: "your-email@gmail.com",
        to: sender.email,
        subject: "Dispatch Request Rejected",
        html: emailHtml,
      });
    }

    res.status(200).json({ message: `Request ${dispatchStatusOut} successfully!` });
  } catch (error) {
    res.status(500).json({ message: "Error updating approval status", error });
  }
};

export const updateDispatchStatusIn = async (req, res) => {
  const { id } = req.params;
  const { dispatchStatusIn, approverNameIn, serviceNoIn, commentIn } = req.body;

  // Validation
  if (!approverNameIn || !serviceNoIn) {
    return res.status(400).json({ message: "Name and Service Number are required!" });
  }
  if (dispatchStatusIn === "Rejected" && !commentIn) {
    return res.status(400).json({ message: "Comment is required for rejection!" });
  }

  try {
    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.dispatchStatusIn = dispatchStatusIn;
    request.approverNameIn = approverNameIn;
    request.serviceNoIn = serviceNoIn;
    request.commentIn = commentIn || ""; 

    await request.save();
    res.status(200).json({ message: `Request ${dispatchStatusIn} successfully!` });
  } catch (error) {
    res.status(500).json({ message: "Error updating approval status", error });
  }
};
