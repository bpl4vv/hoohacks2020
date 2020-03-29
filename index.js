// to run, open the cmd and go the specified folder, then type 'node .'
// requiring discord.js, which was brought in by typing 'npm install discord.js --save' in the specified folder
const Discord = require('discord.js'); 
const PREFIX = '~';

// creation of the bot, token can be found at https://discordapp.com/developers
const Bot = new Discord.Client();
const token = 'NjkzNTEyMzk2Njk4MDI2MDA1.Xn-J4A.OckjNYrHM9aRvJ8KKj8jE8m0zLg';
Bot.on('ready', () => {console.log(`Logged in as ${Bot.user.tag}!`);})

var q = new Queue();
var map = new Map();

Bot.on('guildMemberAdd', member => {
  member.send('You recently joined a server with Queue Bot. Here is some information to use the queue:');
  const helpembed = new Discord.MessageEmbed()
    .setTitle('Queue Bot Help')
    .addField('**COMMANDS:**', "`~queue <description>` - adds you to the queue with <description>\n`~dequeue` - removes you from the queue, only used by specified users (if not specified, removes yourself from the queue)\n`~display` - shows the current queue (and description of each entry, if you have permission\n`~clearall` - priveliged command that clears the queue\n`~help` - displays a list of commands; you're reading it right now")
    .addField('**MORE INFORMATION:**', 'ndd7xv [at] virginia [dot] edu \nsp5fd [at] virginia [dot] edu\nbpl4vv [at] virginia [dot] edu');
  member.send(helpembed);
});

// the different commands this bot takes - queue and dequeue, curently
// alternatively, instead of message.reply one can do 'message.channel.sendMessage()'
Bot.on('message', message=>{
    let args = message.content.substring(PREFIX.length).split(" ");
    switch(args[0]) {
        // adds user to the queue - if already on it, sends them a message with their position
        case 'queue':
            message.channel.bulkDelete(1);
            if(map.has(message.author.username)) {
              message.author.send('You are already on the queue. You are ' + map.get(message.author.username) + ' in the queue.');
            } else {
              var description = args[1] ? ' - ' + args.slice(1, args.length).join(' ') : '';
              q.enqueue('**' + message.author.username + '**' + description);
              map.set(message.author.username, q.getLength());
              message.author.send('You (' + message.author.username + ') have been queued! You are number ' + q.getLength() + ' on the list.');
            }
        break;
        // sends a message to the dequeuer with who was dequeued - in the future, it would check for role/position in the server
        case 'dequeue':
          message.channel.bulkDelete(1);
            if (true) {
                if(q.getLength() > 0) message.author.send('You have dequeued ' + q.peek() + '.');
                else message.author.send('There is no one in the queue.');
                var user = ''+ q.peek();
                user = user.substring(user.indexOf('**') + 2, user.lastIndexOf('**'));
                //user.send('You have been dequeued by ' + message.author.username + '!');
                map.delete(user);
                message.channel.send("Attempting to move " + user +'. In the future, this should only work if you have permissions, and would change the voice chat of the dequeued person.').then(msg=>{msg.delete({timeout:3000})});
                q.dequeue();
            // this would change to dequeue yourself if you do not have the permissions to dequeue from the list
            } else {
                message.channel.send("You can't dequeue, you don't have the permissions!").then(msg=>{msg.delete({timeout : 3000})})
            }
        break;
        // displays the queue
        case 'display':
            const displayembed = new Discord.MessageEmbed()
            .setTitle('**CURRENT QUEUE**')
            .addField('TOP OF QUEUE', q.String());
            message.author.send(displayembed);
            message.channel.bulkDelete(1);
        break;
        // clears the queue
        case 'clearall':
            message.channel.bulkDelete(1);
            q.clearAll();
            message.reply("Queue has been cleared.").then(msg=>{msg.delete({timeout: 3000})});
        break;
        // gives information on the other commands
        case 'help':
            message.channel.bulkDelete(1);
            const helpembed = new Discord.MessageEmbed()
            .setTitle('Queue Bot Help')
            .addField('**COMMANDS:**', "`~queue <description>` - adds you to the queue with <description>\n`~dequeue` - removes you from the queue, only used by specified users (if not specified, removes yourself from the queue)\n`~display` - shows the current queue (and description of each entry, if you have permission\n`~clearall` - priveliged command that clears the queue\n`~help` - displays a list of commands; you're reading it right now")
            .addField('**MORE INFORMATION:**', 'ndd7xv [at] virginia [dot] edu \nsp5fd [at] virginia [dot] edu\nbpl4vv [at] virginia [dot] edu');
            message.author.send(helpembed);
        break;
    }
})

Bot.login(token);

/* Creates a new queue. A queue is a first-in-first-out (FIFO) data structure -
 * items are added to the end of the queue and removed from the front.
 *
 * Code taken from http://code.iamkate.com/javascript/queues/ by Kate Rose Morley
 */
function Queue(){
    // initialise the queue and offset
    var queue  = [];
    var offset = 0;
  
    // Returns the length of the queue.
    this.getLength = function(){
      return (queue.length - offset);
    }
    // Returns true if the queue is empty, and false otherwise.
    this.isEmpty = function(){
      return (queue.length == 0);
    }
    /* Enqueues the specified item. The parameter is:
     *
     * item - the item to enqueue
     */
    this.enqueue = function(item){
      queue.push(item);
    }
    /* Dequeues an item and returns it. If the queue is empty, the value
     * 'undefined' is returned.
     */
    this.dequeue = function(){
  
      // if the queue is empty, return immediately
      if (queue.length == 0) return undefined;
      // store the item at the front of the queue
      var item = queue[offset];

      // increment the offset and remove the free space if necessary
      if (++ offset * 2 >= queue.length){
        queue  = queue.slice(offset);
        offset = 0;
      }
  
      // return the dequeued item
      return item;
    }
    /* Returns the item at the front of the queue (without dequeuing it). If the
     * queue is empty then undefined is returned.
     */
    this.peek = function(){
      return (queue.length > 0 ? queue[offset] : undefined);
    }

    /**
     * New methods for the purpose of queue bot.
     */
    this.clearAll = function() {
        while(this.getLength() != 0) this.dequeue();
    }

    this.String = function() {
        if (this.isEmpty()) return 'The queue is currently empty.';
        var s = '';
        for(var i = 0; i < this.getLength(); i++) {
            s += (i+1) + '. ' + queue[offset+i] +'\n';
        }
        return s;
    }
  }