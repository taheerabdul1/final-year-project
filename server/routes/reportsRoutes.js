import express from "express";
import Donation from "../models/donation.model.js";
import Campaign from "../models/campaign.model.js";
import Mosque from "../models/mosque.model.js";
import PDFDocument from "pdfkit";
import fs from "fs";

const router = express.Router();

router.get("/donations/csv/:mosqueId", async (req, res) => {
  try {
    const donations = await Donation.find({ mosque: req.params.mosqueId })
      .populate("donor", "name")
      .populate("campaign", "name");

    const csvHeader = "Amount,Donor,Campaign\n";

    // Convert donations to CSV format
    const csvRows = donations.map((donation) => {
      return `${donation.amount},${donation.donor.name},${
        donation.campaign?.name || null
      }`;
    });

    const csvData = [csvHeader, ...csvRows].join("\n");

    // Set response headers for CSV download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="donations.csv"'
    );

    // Send the CSV data
    res.send(csvData);
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/donations/pdf/:mosqueId", async (req, res) => {
  try {
    const mosque = await Mosque.findById(req.params.mosqueId);
    if (!mosque)
      throw new Error(`Mosque ${req.params.mosqueId} does not exist`);
    const donations = await Donation.find({ mosque: req.params.mosqueId })
      .populate("donor", "name")
      .populate("campaign", "name");
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(`${__dirname}/output.pdf`);
    doc.pipe(stream);
    doc.text(`Donations Report for Mosque: ${mosque.name}`, {
      align: "center",
    });
    donations.forEach((donation) => {
      doc.text(
        `Donor: ${donation.donor.name}, Amount: ${donation.amount}, Campaign: ${
          donation.campaign?.name || null
        }`
      );
    });
    doc.end();
    stream.on("finish", () => {
      res.sendFile(`${__dirname}/output.pdf`);
    });
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/campaigns/csv/:campaignId", async (req, res) => {
  try {
    const donations = await Donation.find({ campaign: req.params.campaignId })
      .populate("donor", "name")
      .populate("campaign", "name")
      .exec();
    const csvHeader = "Amount,Donor\n";
    const csvRows = donations.map((donation) => {
      return `${donation.amount},${donation.donor.name}`;
    });
    const csvData = [csvHeader, ...csvRows].join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="Campaign_' + campaign.name + '.csv"'
    );
    res.send(csvData);
  } catch (error) {
    console.log(error);
    return res.status(422).send({ message: err.message });
  }
});

router.get("/api/reports/campaigns/pdf/:campaignId", async (req, res) => {
  try {
    const campaign = await Campaign.findOne({ _id: req.params.campaignId });
    const donations = await Donation.find({ campaign: req.params.campaignId })
      .populate("donor", "name")
      .populate("campaign", "name")
      .exec();

    // Create a new PDF document
    const doc = new PDFDocument();

    // Pipe its output somewhere, like to a file or HTTP response
    // Here we're writing to a file
    const stream = fs.createWriteStream(`${__dirname}/output.pdf`);
    doc.pipe(stream);

    // Add content to the PDF
    doc.text(`Donations Report for Campaign: ${campaign.name}`, {
      align: "center",
    });

    // List donations
    donations.forEach((donation) => {
      doc.text(`Donor: ${donation.donor.name}, Amount: ${donation.amount}`);
    });

    // Finalize PDF file
    doc.end();

    // Wait for the stream to finish to send the file
    stream.on("finish", () => {
      res.sendFile(`${__dirname}/output.pdf`);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

export default router;
