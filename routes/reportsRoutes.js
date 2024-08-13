const express = require('express');
const router = express.Router();
const Report = require('../models/Reports');

/**
 * POST method to add a new Report.
 * This function will add a new report if and only if it doesn't overlap with another report.
 * If it does, it will alert the user that the report is invalid and he should fix the hours.
 * This function will also alert the user in case there is a report for the exact same time.
 * This function will also alert if the report time contains another report.
 */
router.post('/report', async (req, res) => {
    try {
        const employeeName = req.body.employeeName;
        const date = req.body.date;
        const startHour = req.body.startHour;
        const endHour = req.body.endHour;
        const comments = req.body.comments;
        const start = new Date(startHour);
        const end = new Date(endHour);

        // Check for overlapping reports
        const overlappingShift = await Report.findOne({
            employeeName: employeeName,
            date: date,
            $or: [
                { startHour: { $lt: end }, endHour: { $gt: start } },
                { startHour: { $lte: start }, endHour: { $gte: end } },
                { startHour: { $gte: start }, endHour: { $lte: end } }
            ]
        });

        if (overlappingShift) {
            return res.status(409).json({ message: "The report overlaps with an existing shift" });
        }

        // Create a new report if no overlap is found
        const report = new Report({
            employeeName: employeeName,
            date: date,
            startHour: start,
            endHour: end,
            comments: comments
        });

        await report.save();
        res.status(201).json(report);
    } catch (error) {
        res.status(400).send(error);
    }
});

/**
 * GET method that will bring all of the employees
 */

router.get('/report', async (req, res) => {
    try {
        const reports = await Report.find();
        if (reports.length === 0) {
            return res.status(404).json({ message: "No reports found" });
        }
        res.status(201).send(reports);
    }
    catch (error) {
        res.status(400).send(error);
    }
})

/**
 * PATCH method that will update the reports.
 * It will update the report if and only if the report does not overlap with another report in the 3 ways I mentioned in the POST method.
 */

router.patch('/report', async (req, res) => {
    try {
        const employeeName = req.body.employeeName;
        const date = req.body.date;
        const startHour = req.body.startHour;
        const endHour = req.body.endHour;
        const comments = req.body.comments;
        const number = req.body.number;
        // return res.send(overlappingShift);
        const start = new Date(startHour);
        const end = new Date(endHour);

        // Simplified overlap check: only check if the new time range overlaps with any existing time range
        const overlappingShift = await Report.find({
            employeeName: employeeName,
            date: date,
            $or: [
                { startHour: { $lt: end }, endHour: { $gt: start } },
                { startHour: { $lte: start }, endHour: { $gte: end } },
                { startHour: { $gte: start }, endHour: { $lte: end } }
            ]
        });

        // return res.send(overlappingShift);
        // Check for any overlap with a different report number using a for loop
        for (let report of overlappingShift) {
            if (report.number !== number) {
                return res.status(409).json({ message: "The report overlaps with an existing shift" });
            }
        }

        const report = await Report.findOne({ number: number });
        if (!report) {
            return res.status(404).json({ message: "The report was not found" });
        }

        report.employeeName = employeeName;
        report.date = date;
        report.startHour = startHour;
        report.endHour = endHour;
        report.comments = comments;
        await report.save();
        res.status(200).json(report);
    }
    catch (error) {
        res.status(400).send(error);
    }
})

/**
 * DELETE method that will remove a report from the DB
 */

router.delete('/report', async (req, res) => {
    try {
      const report = await Report.findOneAndDelete({ number: req.body.number });
      if (!report) {
        return res.status(404).send("Report not found");
      }
      res.status(200).send(report);
    } catch (error) {
      res.status(500).send(error);
    }
  });


module.exports = router;