import { promises as fs } from "fs";
import fetch from "node-fetch";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataFolderPath = path.join(__dirname, "data");

// Fetch data from JSONPlaceholder and save to local file
async function fetchDataAndSave(resource) {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/${resource}`
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${resource}: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    await saveData(resource, data);
    console.log(`${resource} data fetched and saved.`);
  } catch (error) {
    console.error(`Error fetching ${resource} data:`, error);
  }
}

// Load data from the file
export async function loadData(resource) {
  try {
    const data = await fs.readFile(
      path.join(dataFolderPath, `${resource}.json`)
    );
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${resource} data file:`, error);
    return [];
  }
}

// Save data to the file
async function saveData(resource, data) {
  try {
    await fs.writeFile(
      path.join(dataFolderPath, `${resource}.json`),
      JSON.stringify(data, null, 2)
    );
  } catch (error) {
    console.error(`Error writing ${resource} data to file:`, error);
  }
}

// Initialize data for each resource if files don't exist
// Initialize data for each resource if files don't exist
export async function initializeData() {
  try {
    await fs.access(dataFolderPath); // Check if folder exists
  } catch (error) {
    console.log("Data folder not found. Creating...");
    await fs.mkdir(dataFolderPath, { recursive: true });
  }
  const resources = ["posts", "comments", "albums", "photos", "todos", "users"];
  for (const resource of resources) {
    const filePath = path.join(dataFolderPath, `${resource}.json`);
    try {
      await fs.access(filePath); // Check if file exists
      console.log(`${resource} data file already exists.`);
    } catch (error) {
      console.log(
        `${resource} data file doesn't exist. Fetching from JSONPlaceholder...`
      );
      await fetchDataAndSave(resource);
    }
  }
}

// Example save function for creating a new item for the specified resource
export async function createItemForResource(resource, newItem) {
  const data = await loadData(resource);
  let maxId = 0;

  // Find the maximum id in the existing data
  for (const item of data) {
    if (item.id > maxId) {
      maxId = item.id;
    }
  }

  // Generate a new id by incrementing the maximum id
  const newId = maxId + 1;
  const itemWithId = { id: newId, ...newItem }; // Add the new id to the item
  data.push(itemWithId); // Push the item to the data array
  await saveData(resource, data); // Save the updated data
  return itemWithId; // Return the newly created item with id
}

// Example update function for updating an item with the specified ID for the specified resource
export async function updateItemForResourceById(resource, id, updatedItem) {
  const filePath = path.join(dataFolderPath, `${resource}.json`);
  try {
    const data = await loadData(resource);
    const index = data.findIndex((item) => item.id === parseInt(id));
    if (index === -1) {
      throw new Error(`${resource} item not found with ID ${id}`);
    }
    data[index] = { ...data[index], ...updatedItem };
    await saveData(resource, data);
    return data[index];
  } catch (error) {
    throw new Error(`Error updating ${resource} item: ${error.message}`);
  }
}

// Example patch function for partially updating an item with the specified ID for the specified resource
export async function patchItemForResourceById(resource, id, updatedFields) {
  const filePath = path.join(dataFolderPath, `${resource}.json`);
  try {
    const data = await loadData(resource);
    const index = data.findIndex((item) => item.id === parseInt(id));
    if (index === -1) {
      throw new Error(`${resource} item not found with ID ${id}`);
    }
    Object.assign(data[index], updatedFields);
    await saveData(resource, data);
    return data[index];
  } catch (error) {
    throw new Error(`Error patching ${resource} item: ${error.message}`);
  }
}

// Example delete function for deleting an item with the specified ID for the specified resource
export async function deleteItemForResourceById(resource, id) {
    const filePath = path.join(dataFolderPath, `${resource}.json`);
    try {
      const data = await loadData(resource);
      const index = data.findIndex((item) => item.id === parseInt(id));
      if (index === -1) {
        throw new Error(`${resource} item not found with ID ${id}`);
      }
      data.splice(index, 1); // Remove the item from the array
      await saveData(resource, data);
      return { message: `Deleted ${resource} item with ID ${id}` };
    } catch (error) {
      throw new Error(`Error deleting ${resource} item: ${error.message}`);
    }
  }
  