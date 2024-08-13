const express = require('express');
const router = express.Router();
const Employee = require('../models/Employees');

/**
 * POST method to add a new Employee
 */
router.post('/employee', async (req, res) => {
  try {
    const employee = new Employee(req.body);

    /**
     * The reason I didn't add validation for duplication is because I added unique ID to each employee which allows name duplications
     */

    await employee.save();

    res.status(201).send(employee);
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
 * GET method that will bring all of the employees
 */

router.get('/employee', async (req, res) => {
  try {
    const employees = await Employee.find();
    if (employees.length === 0) {
      return res.status(404).json({ message: "No employees found" });
    }
    res.status(201).send(employees);
  }
  catch (error) {
    res.status(400).send(error);
  }
})


/**
 * PATCH method that will update the name of the employee
 */

router.patch('/employee', async (req, res) => {
  try {
      const body = req.body;
      const name = body.newName;
      const employee = await Employee.findOne(
          { id: body.id },
      );

      // In case the employee was not found in the DB
      if (!employee) {
          return res.status(404).json({ message: "Employee not found" });
      }

      employee.name=name;
      await employee.save();


      res.status(200).json(employee);
  } catch (error) {
      res.status(400).send(error);
  }
});
/**
 * DELETE method that will delete employee
 */
router.delete('/employee', async (req, res) => {
  try {
    const employee = await Employee.findOneAndDelete({ id: req.body.id });
    if (!employee) {
      return res.status(404).send("Employee not found");
    }
    res.status(200).send(employee);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
