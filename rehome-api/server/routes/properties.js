import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// Get all properties
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT p.*, GROUP_CONCAT(pi.image_url) as images
      FROM properties p
      LEFT JOIN property_images pi ON p.id = pi.property_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء جلب العقارات' });
  }
});

// Add new property
router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const propertyData = req.body;

    const [result] = await connection.execute(`
      INSERT INTO properties (
        manual_date, compound_name, location, developer_price,
        total_price, over_price, remaining_installments,
        maintenance_fee, maintenance_rate, installment_years,
        delivery_date, commission_rate, total_commission,
        unit_type, area, rooms, bathrooms, finishing_type,
        additional_details, owner_name, phone_number,
        platform_source, contact_method, whatsapp_number,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available')
    `, [
      propertyData.manual_date,
      propertyData.compound_name,
      propertyData.location,
      propertyData.developer_price || 0,
      propertyData.total_price || 0,
      propertyData.over_price || 0,
      propertyData.remaining_installments || 0,
      propertyData.maintenance_fee || 0,
      propertyData.maintenance_rate || 0,
      propertyData.installment_years || 0,
      propertyData.delivery_date,
      propertyData.commission_rate || 0,
      propertyData.total_commission || 0,
      propertyData.unit_type || '',
      propertyData.area || 0,
      propertyData.rooms || 0,
      propertyData.bathrooms || 0,
      propertyData.finishing_type || '',
      propertyData.additional_details || '',
      propertyData.owner_name || '',
      propertyData.phone_number || '',
      propertyData.platform_source || '',
      propertyData.contact_method || '',
      propertyData.whatsapp_number || ''
    ]);

    if (propertyData.images?.length > 0) {
      const imageValues = propertyData.images.map((url, index) => [
        result.insertId,
        url,
        index === 0 ? 1 : 0
      ]);

      await connection.query(`
        INSERT INTO property_images (property_id, image_url, is_primary)
        VALUES ?
      `, [imageValues]);
    }

    await connection.commit();
    res.status(201).json({
      success: true,
      message: 'تم إضافة العقار بنجاح',
      property_id: result.insertId
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إضافة العقار',
      error: error.message
    });
  } finally {
    connection.release();
  }
});

export default router; 