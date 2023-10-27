const stage = document.getElementById(`stage`);

export default {
  uri: `/admin/hall.php`,
  updateIntervalMs: 5000,
  stage: {
    container: stage,
    grid: {
      cellSize: 24,
      cellSizeMin: 12,
      cellSizeMax: 48,
      gridColor: `#f2f2f2`,
      gridStroke: 1,
      backgroundColor: `#fff`,
      borderColor: `#d7d7d7`,
      borderWidth: 2,
    }
  },
  sprite: {
    remove: {
      backgroundColor: `#03a9f3`,
      borderColor: `#fff`,
      color: `#fff`,
      borderWidth: 2,
    }
  }
}

