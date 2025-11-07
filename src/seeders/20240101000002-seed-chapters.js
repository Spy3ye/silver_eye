export const up = async (queryInterface) => {
  const now = new Date();

  const chapters = [
    {
      chapter_number: 1,
      chapter_id: 'CH-ALPHA',
      chapter_image: 'https://example.com/chapters/ch-alpha.jpg',
      chapter_script: 'Chapter Alpha introduces the participants to the core mechanics of the competition.',
      created_at: now,
      updated_at: now
    },
    {
      chapter_number: 2,
      chapter_id: 'CH-BRAVO',
      chapter_image: 'https://example.com/chapters/ch-bravo.jpg',
      chapter_script: 'Chapter Bravo expands on the narrative with team-based challenges.',
      created_at: now,
      updated_at: now
    }
  ];

  await queryInterface.bulkInsert('chapters', chapters, {});
};

export const down = async (queryInterface) => {
  await queryInterface.bulkDelete('chapters', {
    chapter_id: ['CH-ALPHA', 'CH-BRAVO']
  });
};

