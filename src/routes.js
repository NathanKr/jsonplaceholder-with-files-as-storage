// routes.js
import express from "express";
import bodyParser from "body-parser";
import {
  loadData,
  createItemForResource,
  updateItemForResourceById,
  patchItemForResourceById,
  deleteItemForResourceById
} from "./storage-utils.js";

const router = express.Router();

// Middleware to parse JSON bodies
router.use(bodyParser.json());

// GET all resources
router.get("/:resource", async (req, res) => {
  const resource = req.params.resource;
  const data = await loadData(resource);
  res.json(data);
});

// GET a specific resource by id
router.get("/:resource/:id", async (req, res) => {
  const resource = req.params.resource;
  const data = await loadData(resource);
  const item = data.find((item) => item.id === parseInt(req.params.id));
  if (!item) {
    res.status(404).json({ error: `${resource.slice(0, -1)} not found` });
  } else {
    res.json(item);
  }
});

// POST a new resource item
router.post("/:resource", async (req, res) => {
  const resource = req.params.resource;
  try {
    const newItem = req.body;
    const savedItem = await createItemForResource(resource, newItem);
    res.status(201).json(savedItem); // Assuming savedItem contains the newly created item
  } catch (error) {
    console.error(`Error creating a new ${resource} item:`, error);
    res.status(500).json({ error: `Failed to create a new ${resource} item` });
  }
});

// PUT (full update) a resource item by ID
router.put("/:resource/:id", async (req, res) => {
  const resource = req.params.resource;
  const itemId = req.params.id;
  try {
    const updatedItem = req.body;
    const result = await updateItemForResourceById(
      resource,
      itemId,
      updatedItem
    );
    res.json(result); // Assuming result contains the updated item
  } catch (error) {
    console.error(`Error updating the ${resource} item:`, error);
    res.status(500).json({ error: `Failed to update the ${resource} item` });
  }
});

// PATCH (partial update) a resource item by ID
router.patch("/:resource/:id", async (req, res) => {
  const resource = req.params.resource;
  const itemId = req.params.id;
  try {
    const updatedFields = req.body;
    const result = await patchItemForResourceById(
      resource,
      itemId,
      updatedFields
    );
    res.json(result); // Assuming result contains the updated fields
  } catch (error) {
    console.error(`Error patching the ${resource} item:`, error);
    res.status(500).json({ error: `Failed to patch the ${resource} item` });
  }
});

// DELETE a resource item by ID
router.delete("/:resource/:id", async (req, res) => {
  const resource = req.params.resource;
  const itemId = req.params.id;
  try {
    await deleteItemForResourceById(resource, itemId);
    // Respond with a success message or appropriate response
    res.json({ message: `Deleted ${resource} item with ID ${itemId}` });
  } catch (error) {
    console.error(`Error deleting the ${resource} item:`, error);
    res.status(500).json({ error: `Failed to delete the ${resource} item` });
  }
});

export default router;
