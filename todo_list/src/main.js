import 'todomvc-app-css/index.css'
import Vue from 'vue'
//用过滤器对 下面的状态进行设置
var filters = {
  all(todos) {
    return todos
  },
  //剩下的
  active(todos) {
    return todos.filter((todo) => {
      return !todo.completed
    })
  },
  completed(todos) {
    return todos.filter((todo) => {
      return todo.completed
    })
  }
};
let app = new Vue({
  el: '.todoapp',

  data: {
    newTodo: '',
    todos: [
      {
        content: 'vue',
        completed: false
      },
      {
        content: 'vux',
        completed: false
      }
    ],
    //双击编辑的初始值
    editedTodo: null,
    //哈希值
    hashName: 'all'
  },
  computed: {
    remain() {
      return filters.active(this.todos).length
    },
    isAll: {
      //控制全选状态
      get() {
        return this.remain === 0
      },
      set(value) {
        this.todos.forEach((todo) => {
          todo.compuleted = value
        })
      },
    },
    //状态 哈希
    filteredTodos() {
      return filters[this.hashName](this.todos)
    }
  },

  methods: {
    addTodo(e) {
      //进行实时渲染
      //去掉空格
      if (!this.newTodo) {
        return
      }
      this.todos.push({
        content: this.newTodo,
        //默认不选中
        completed: false
      });
      //清空当前 的input
      this.newTodo = ""
    }
    ,
    removeTodo(index) {
      this.todos.splice(index, 1)
    },
    //双击编辑内容
    editTodo(todo) {
      //按下Esc的时候 进行缓存
      this.editCache = todo.content;
      this.editedTodo = todo
    },
    //各种事件与一体 各种状态 确认提交事件
    doneEdit(todo, index) {
      //按下回车键  空白就删除
      this.editedTodo = null;
      if (!todo.content) {
        this.removeTodo(index)
      }
    },
    cancleEdit(todo) {
      // 逻辑 选中的值取消 读取缓存
      this.editedTodo = null;
      todo.content = this.editCache
    },
    //点击清除 按钮事件  逻辑是 把剩下的 渲染给总数量 todos
    clear() {
      this.todos = filters.active(this.todos)
    }

  },
  //自定义指令同上关联
  directives: {
    focus(el, value) {
      if (value) {
        el.focus()
      }
    }
  }
});

//哈希进行跳转
function hashChange() {
  let hashName = location.hash.replace(/#\/?/, '');
  if (filters[hashName]) {
    app.hashName = hashName
  } else {
    location.hash = '';
    app.hashName = 'all'
  }
}

window.addEventListener('hashchange', hashChange)
