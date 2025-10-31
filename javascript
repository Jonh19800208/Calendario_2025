      const isWeekend = [0, 6].includes(date.getDay());
      if (isWeekend && turno && turno !== '' && turno !== 'V' && turno !== 'B' && turno !== 'LPF' && turno !== 'F' && turno !== 'FL') {
        weekendDays++;
      }

        const isWeekend = [0, 6].includes(date.getDay());
        if (isWeekend && turno && turno !== '' && turno !== 'V' && turno !== 'B' && turno !== 'LPF' && turno !== 'FL') totalWeekendDays++;

