<template>
  <div class="container">
    <div class="file_form">
      <input type="file" ref="uploadForm" @change="addFiles" multiple />
    </div>
    <div
      class="drop_area"
      :class="{drag_over: draggingOver}"
      @dragenter="dragEnter($event)"
      @dragleave="dragLeave($event)"
      @dragover="dragOver($event)"
      @drop="drop($event)"
    >
      <h2>Drop files to upload here</h2>
    </div>

    <div class="files" v-for="progress in progresses" :key="progress">
      <hr />
      <h5 style="background-color: #ddeeff; width: 80vw;">{{ progress }}</h5>
      <transition-group name="fade" mode="in-out" tag="div" class="files-container">
        <div class="row" v-for="file in filesByProgress[progress]" :key="file.index">

          <div class="cell no">
            {{ ('00' + (file.index +1)).slice(-2) }}
          </div>
          <div class="cell filename">
            <small style="opacity: .5">{{file.name}}</small>
            <br>
            <input type="text" v-model="file.uploadName" />
          </div>
          <div class="cell type">
            {{file.type}}
          </div>
          <div class="cell size">
            {{file.size}} <small>bytes</small>
          </div>
          <div class="cell last-modified">
            {{(new Date(file.lastModified)).toISOString() }}
          </div>
          <div class="cell upload">
            <a-button @click="uploadFile(file)">UPLOAD</a-button>
          </div>
          <div class="cell cancel">
            <a-button @click="cancelFile(file)">CANCEL</a-button>
          </div>

        </div>
      </transition-group>
    </div>

  </div>

</template>

<script setup>
import {
  onMounted,
  computed,
  reactive,
  ref,
} from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import rest from '@/http/rest'

const store = useStore();
const uploadForm = ref(null);

const isLoggedIn = computed(() => (store.getters['auth/isLoggedIn']))
let userInfo = computed(() => store.getters['auth/userInfo']);
// const filesByProgress = computed(() => (store.getters['files/filesByProgress']));
// const files = computed(() => (store.getters['files/files']));

const progresses = ['added', 'failed', 'uploading', 'completed'];
const filesByProgress = computed(() => {
  const result = {};
  const files = store.getters['files/filesAll'];
  progresses.map(progress => {
    result[progress] = files.filter(f => (f.progress === progress));
  });
  return result
});


function addFiles(event) {
  console.log(event)
  const files = event.target.files;
  handleFiles(files)
}

// Drag and Drop behavior
let draggingOver = ref(false);
let innerCounter = 0;
function dragEnter(event) {
  event.stopPropagation();
  event.preventDefault();
  draggingOver.value = true;
  innerCounter ++;
}
function dragLeave(event) {
  innerCounter --;
  if (innerCounter === 0) {
    draggingOver.value = false;
  }
}
function dragOver(event) {
  event.stopPropagation();
  event.preventDefault();
}
function drop(event) {
  event.stopPropagation();
  event.preventDefault();
  draggingOver.value = false;
  const dt = event.dataTransfer;
  const files = dt.files;
  handleFiles(files);
}

let fileCount = 0;
function handleFiles(files) {
  for (let file of files) {
    file.uploadName = file.name;
    file.index = fileCount;
    // progress: added --> uploading --> completed | failed
    file.progress = 'added';
    fileCount++;
    store.dispatch('files/addFile', file)
    // filesToUpload.push(file)
    // const reader = new FileReader();
    // reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
    // reader.readAsDataURL(file);
  }
}
function uploadFile(file) {
  console.log('upload file', file)
  store.dispatch('files/uploadFile', file)
}
function cancelFile(file) {
  console.log('cancel file', file)
  store.dispatch('files/cancelFile', file)
}

const currentRoute = useRoute();
const router = useRouter();
onMounted(()=>{
  const {name, meta, fullPath, params, query} = currentRoute;
  if (isLoggedIn.value && userInfo.value && !userInfo.value.sub) {
    store.dispatch('auth/getUserInfo')
  }
})
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  .file_form {
    margin: 1rem;
  }
  .drop_area {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 400px;
    height: 100px;
    border-radius: 20px;
    background-color: #e0f0ff;
    transition: all 0.2s ease;
    opacity: 0.5;
    &.drag_over {
      width: 500px;
      //background-color: #70a0ff;
      opacity: 1;
    }
  }
}
.files {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  transition: all 0.3s ease;
  .row {
    display: table;
    margin: 2px 0;

    .cell {
      display: table-cell;
      margin: 5px;
      text-align: center;
      background-color: #f7f7f7;
      border: 4px solid white;
      border-radius: 8px;
      vertical-align: middle;
      &.filename {
        width: 320px;
        text-align: left;
        & > small {
          padding: 4px 0 0 2px;
          margin: 0;
        }
        & > input {
          padding: 1px 10px;
          width: calc(100% - 22px);
          border: 1px lightgray solid;
          border-radius: 4px;
          font-size: 1rem;
        }
      }
      &.type {
        width: 120px;
        font-size: 0.8rem;
      }
      &.size {
        width: 100px;
        font-size: 1rem;
        text-align: right;
      }
      &.last-modified {
        width: 180px;
        font-size: 0.8rem;
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
