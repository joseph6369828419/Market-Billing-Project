import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Category.css';

const Category = () => {
  const [categoryName, setcategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleCategoryChange = (e) => {
    setcategoryName(e.target.value);
  };

  
  const handleAddCategory = async () => {
    if (isEditing) {
      try {
        await axios.put(`/updatecategory/${categories[editIndex]._id}`, { categoryName });
        const updatedCategories = [...categories];
        updatedCategories[editIndex] = { ...categories[editIndex], categoryName };
        setCategories(updatedCategories);
        setIsEditing(false);
        setEditIndex(null);
      } catch (error) {
        console.error('Error updating category:', error);
      }
    } else {
      try {
        const response = await axios.post('/addcategory', { categoryName });
        setCategories([...categories, response.data]);
      } catch (error) {
        console.error('Error adding category:', error);
      }
    }
    resetForm();
  };

  const handleEditCategory = (index) => {
    setcategoryName(categories[index].categoryName);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleDeleteCategory = async (index) => {
    try {
      await axios.delete(`/deletecategory/${categories[index]._id}`);
      const updatedCategories = [...categories];
      updatedCategories.splice(index, 1);
      setCategories(updatedCategories);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const resetForm = () => {
    setcategoryName('');
  };

  return (
    <div className='category-parent'>
      <label>
        Category Name
        <input type="text" value={categoryName} onChange={handleCategoryChange} />
      </label>
      <button onClick={handleAddCategory}>{isEditing ? 'Update Category' : 'Add Category'}</button>
      {isEditing && <button onClick={() => { setIsEditing(false); resetForm(); }}>Cancel</button>}
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Category Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={index} onClick={() => handleEditCategory(index)}>
              <td>{index + 1}</td>
              <td>{category.categoryName}</td>
              <td>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteCategory(index); }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Category;
