PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      email TEXT,
      full_name TEXT,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
INSERT INTO users VALUES('1653ce58-a573-4946-aee4-c480233b7ae6','rdb','$2b$10$rooLNBtdeCmU94pSsiEbDu06IH3UkIsmF2brXUTCynwktoGbs7UHK','r@b.c','b','user','2025-10-08 10:41:07','2025-10-08 10:41:07');
CREATE TABLE form_submissions (
      id TEXT PRIMARY KEY,
      created_by_user_id TEXT NOT NULL,

      -- Header Information
      county TEXT,
      district TEXT,
      building_type TEXT CHECK(building_type IN ('leased', 'owned')),
      school_building TEXT,
      completed_by TEXT,
      completion_date DATE,

      -- Section A Data (JSON for flexibility)
      section_a_items TEXT,
      section_a_notes TEXT,

      -- Section B Data (JSON for flexibility)
      section_b_items TEXT,
      section_b_notes TEXT,

      -- Auto-calculated scores
      section_a_no_count INTEGER DEFAULT 0,
      section_a_compliant BOOLEAN DEFAULT 0,
      section_b_yes_count INTEGER DEFAULT 0,
      section_b_no_count INTEGER DEFAULT 0,
      section_b_na_count INTEGER DEFAULT 0,
      section_b_percentage REAL DEFAULT 0,
      section_b_compliant BOOLEAN DEFAULT 0,
      overall_compliant BOOLEAN DEFAULT 0,

      -- Signatures
      signature_1_name TEXT,
      signature_1_title TEXT,
      signature_1_date DATE,
      signature_2_name TEXT,
      signature_2_title TEXT,
      signature_2_date DATE,
      signature_3_name TEXT,
      signature_3_title TEXT,
      signature_3_date DATE,

      -- Metadata
      status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'submitted')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      submitted_at DATETIME,

      FOREIGN KEY (created_by_user_id) REFERENCES users(id)
    );
INSERT INTO form_submissions VALUES('ed417f87-3769-4e08-973a-dd2eda96fe35','1653ce58-a573-4946-aee4-c480233b7ae6','Essex','District 2','leased','123 Main Street','Rich B','2025-10-08','{"1":{"response":"yes","location":""},"2":{"response":"na","location":"location 3"},"3":{"response":"yes","location":"location 2"},"4":{"response":"yes","location":""},"5":{"response":"na","location":""},"6":{"response":"yes","location":""},"7":{"response":"na","location":""},"8":{"response":"yes","location":""},"9":{"response":"yes","location":""},"10":{"response":"yes","location":""},"11":{"response":"yes","location":""},"12":{"response":"yes","location":""},"13":{"response":"yes","location":""},"14":{"response":"yes","location":""},"15":{"response":"yes","location":""},"16":{"response":"yes","location":""},"17":{"response":"yes","location":""},"18":{"response":"yes","location":""},"19":{"response":"yes","location":""},"20":{"response":"yes","location":""},"21":{"response":"yes","location":""},"22":{"response":"yes","location":""},"23":{"response":"yes","location":""},"24":{"response":"yes","location":""},"25":{"response":"yes","location":""}}','Section A notes','{"1":{"response":"no","location":"location 4"},"2":{"response":"yes","location":""},"3":{"response":"yes","location":""},"4":{"response":"yes","location":""},"5":{"response":"yes","location":""},"6":{"response":"yes","location":""},"7":{"response":"yes","location":""},"8":{"response":"yes","location":"fgfgfg"},"9":{"response":"yes","location":"bvghghgh"},"10":{"response":"yes","location":""},"11":{"response":"yes","location":""},"12":{"response":"yes","location":""},"13":{"response":"yes","location":""},"14":{"response":"yes","location":""},"15":{"response":"na","location":""},"16":{"response":"yes","location":""},"17":{"response":"yes","location":""},"18":{"response":"yes","location":""},"19":{"response":"yes","location":""},"20":{"response":"yes","location":""},"21":{"response":"yes","location":""},"22":{"response":"yes","location":""},"23":{"response":"yes","location":""},"24":{"response":"yes","location":""},"25":{"response":"yes","location":""},"26":{"response":"yes","location":""},"27":{"response":"na","location":""},"28":{"response":"na","location":""},"29":{"response":"no","location":""},"30":{"response":"na","location":""},"31":{"response":"yes","location":""},"32":{"response":"na","location":""},"33":{"response":"na","location":""},"34":{"response":"no","location":"location D"}}','Section B notes',0,1,25,3,6,89.29999999999999716,1,1,'Rich','Head Honcho','2025-10-08','Ron','Junior Honcha','2025-10-08','Don','Honcho in Training','2025-10-08','submitted','2025-10-08 10:43:03','2025-10-12 03:45:10','2025-10-12 03:45:10');
CREATE INDEX idx_submissions_user ON form_submissions(created_by_user_id);
CREATE INDEX idx_submissions_status ON form_submissions(status);
CREATE INDEX idx_submissions_school ON form_submissions(school_building);
CREATE INDEX idx_submissions_created ON form_submissions(created_at);
COMMIT;
