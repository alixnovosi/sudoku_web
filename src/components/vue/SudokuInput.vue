<template>
  <div class="sudokuInput">
    <form class="modeSelect">
      <input type="radio" id="solveMode" v-model="editMode" value="true">
      <label for="solveMode"> Solve Square </label>

      <input type="radio" id="hintMode" v-model="editMode" value="false">
      <label for="hintMode"> Set Square Hints </label>
    </form>

    <table class="buttonGrid">
      <tr v-for="(buttonRow, r) in numpadButtons" :key="r">
        <td v-for="(button, c) in buttonRow" :key="c">
          <button v-bind:class="button.getClasses()" v-on:click="onNumberClick(button.value, r, c)">
            {{ button.value }}
          </button>
        </td>
      </tr>
    </table>
  </div>
</template>
<script lang="ts"></script>
