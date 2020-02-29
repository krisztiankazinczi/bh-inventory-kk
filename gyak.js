const arr = [ 
  { id: 7, groupname: 'delTeszt', parent_id: 0 },
  { id: 1, groupname: 'Szamitastechnika', parent_id: 0 },
  { id: 4, groupname: 'Szorakozas', parent_id: 0 },
  { id: 9, groupname: 'Vilagitastechnika', parent_id: 0 },
  { id: 2, groupname: 'Konyhatechnika', parent_id: 1 },
  { id: 3, groupname: 'Szepsegapolas', parent_id: 1 },
  { id: 5, groupname: 'Futestechnika', parent_id: 4 },
  { id: 6, groupname: 'Elelmiszer', parent_id: 4 } 
  ];

  for(let i = 0; i < arr.length; i++) {
    if (arr[i].parent_id === 0) {
      for(let j = 0; j < arr.length; j++) {
        if (arr[j].parent_id == arr[i].id) {
          arr.splice(i+1, 0, ...arr.splice(j, 1))
        }
      }
    }
  }

  console.log(arr)