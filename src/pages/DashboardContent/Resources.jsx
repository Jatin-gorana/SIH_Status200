import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { FaEdit, FaTrash, FaPlusCircle } from 'react-icons/fa';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [newResource, setNewResource] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [resourceIdToEdit, setResourceIdToEdit] = useState('');
  const [editResourceText, setEditResourceText] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'resources'), (snapshot) => {
      const resourcesArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setResources(resourcesArray);
    });
    return () => unsubscribe();
  }, []);

  const handleAddResource = async () => {
    if (newResource) {
      await addDoc(collection(db, 'resources'), { text: newResource });
      setNewResource('');
    }
  };

  const handleDeleteResource = async (id) => {
    await deleteDoc(doc(db, 'resources', id));
  };

  const handleEditResource = async () => {
    await updateDoc(doc(db, 'resources', resourceIdToEdit), { text: editResourceText });
    setEditMode(false);
    setResourceIdToEdit('');
    setEditResourceText('');
  };

  const startEditResource = (id, text) => {
    setEditMode(true);
    setResourceIdToEdit(id);
    setEditResourceText(text);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-white p-6">
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Mentor Planning</h2>

        {/* Add Resource */}
        <div className="flex mb-4">
          <input
            type="text"
            value={newResource}
            onChange={(e) => setNewResource(e.target.value)}
            placeholder="Add a new Task..."
            className="w-full p-2 rounded-l-lg bg-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
          />
          <button
            onClick={handleAddResource}
            className="px-4 py-2 bg-blue-600 rounded-r-lg hover:bg-blue-700 flex items-center justify-center"
          >
            <FaPlusCircle className="text-white" />
          </button>
        </div>

        {/* Resources List */}
        <ul className="space-y-4">
          {resources.map((resource) => (
            <li key={resource.id} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
              {editMode && resourceIdToEdit === resource.id ? (
                <div className="flex w-full">
                  <input
                    type="text"
                    value={editResourceText}
                    onChange={(e) => setEditResourceText(e.target.value)}
                    className="w-full p-2 rounded-lg bg-gray-600"
                  />
                  <button
                    onClick={handleEditResource}
                    className="ml-2 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <span className="flex-1">{resource.text}</span>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => startEditResource(resource.id, resource.text)}
                      className="text-yellow-400 hover:text-yellow-500"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteResource(resource.id)}
                      className="text-red-400 hover:text-red-500"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Resources;
