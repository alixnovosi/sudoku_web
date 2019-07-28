<template>
  <div class="sudokuSection">
    <sudoku-input :state="this.state"> </sudoku-input>
    <sudoku-grid :state="state"> </sudoku-grid>
    <sudoku-checker :state="state"> </sudoku-checker>
  </div>
</template>

<script lang="ts" src="../ts/SudokuGame.ts"></script>
