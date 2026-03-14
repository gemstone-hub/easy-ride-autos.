-- Seed data for Cars
INSERT INTO cars (title, subtitle, price, year, transmission, mileage, status, image, description, features)
VALUES 
(
  'Toyota Camry SE', 
  '2.5L I4 F DOHC 16V', 
  '18,500,000', 
  '2019', 
  'Auto', 
  '45K mi', 
  'Available', 
  'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?auto=format&fit=crop&q=80&w=800', 
  'Well maintained Toyota Camry with clean title. Features include leather seats, backup camera, and bluetooth connectivity.', 
  ARRAY['Bluetooth', 'Backup Camera', 'Alloy Wheels', 'Leather Seats']
),
(
  'Honda Accord Sport', 
  '1.5L I4 DOHC 16V Turbocharged', 
  '22,000,000', 
  '2021', 
  'Auto', 
  '32K mi', 
  'Incoming', 
  'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&q=80&w=800', 
  'Sporty and efficient Honda Accord. Excellent condition inside and out.', 
  ARRAY['Apple CarPlay', 'Android Auto', 'Lane Assist', 'Sunroof']
),
(
  'Lexus RX 350', 
  '3.5L V6 DOHC 24V', 
  '35,000,000', 
  '2020', 
  'Auto', 
  '58K mi', 
  'Available', 
  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800', 
  'Luxury midsize SUV with premium features and a comfortable ride.', 
  ARRAY['Navigation', 'Premium Sound', 'Heated Seats', 'Power Liftgate']
);

-- Seed data for Gallery
INSERT INTO gallery_items (title, description, before_image, after_image)
VALUES
(
  'Toyota Highlander Front Bumper Repair', 
  'Extensive front-end collision damage repaired to factory spec with OEM parts.', 
  '/gallery/highlander_damaged.png', 
  '/gallery/highlander_repaired.png'
),
(
  'Lexus ES 350 Side Panel & Door Restoration', 
  'Deep scrapes and side-panel denting fully restored with color-matched multi-stage paint.', 
  '/gallery/lexus_damaged.png', 
  '/gallery/lexus_repaired.png'
);
