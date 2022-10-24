import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const modal = document.getElementById('modal')
const modalCloseBtn = document.getElementById('modal-close-btn')
const modalText = document.getElementById('modal-text')
const sumInput = document.getElementById('sum-input')

let randomNumber = 0

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    } 
})

document.addEventListener('click', function(e) {
    if (e.target.id === 'modal-close-btn') {
        resetModal()
        modal.style.display = 'none'
        modalCloseBtn.disabled = true 
    } 
})


document.addEventListener('click', function(e) {
    if (e.target.id === 'submit-btn') {
        const sum = document.getElementById('sum-input').value 
    
        const answer = Math.floor(3.14 + randomNumber).toString()
        
        console.log(answer)
        console.log(sum)
        
        document.getElementById('modal-inner').innerHTML = `
            <h2>Human OR 🤖</h2>
            <div class="modal-inner-loading">
                <img src="images/loading.svg" class="loading">
                <p id="upload-text">Checking your answer...</p>
            </div>`
        
        setTimeout(function(){
                document.getElementById('upload-text').innerText = `The robots are working...`
            }, 1500) 
        
        setTimeout(function() {
            if (sum === answer) {
                document.getElementById('modal-inner').innerHTML = `
                    <h2>Congratulations!</h2>
                    <p>You are human.</p>
                ` 
                modalCloseBtn.disabled = false 
            } else if (sum != answer) {
                document.getElementById('modal-inner').innerHTML = `
                    <h2>Nope!</h2>
                    <p>Incorrect.</p>
                `
                setTimeout(function() {
                    resetModal()
                    renderModal()
                }, 3000)
            }
        }, 3000) 
    }
})

function renderModal() {
    const submitBtn = document.getElementById('submit-btn')
    
    modal.style.display = 'inline'
    
    document.getElementById('modal-text').innerText = `
        Take the sum of pi and ${generateRandomNumber()}. Then round the result. What is the answer?
    `
}

function resetModal() {
    document.getElementById('modal-inner').innerHTML = `
			<h2>Human OR 🤖</h2>
			<p class="modal-text" id="modal-text"></p>
			<input id="sum-input" type="number" name="sumInput" placeholder="Enter sum" required/>

			<div id="modal-choice-btns">
				<button class="modal-choice-btn" id="submit-btn">Submit</button>
			</div>
    `
    
    randomNumber = generateRandomNumber()
    
    document.getElementById('modal-text').innerText = `
        Take the sum of pi and ${randomNumber}. Then round the result. What is the answer?
    `
}
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')
    
    if(tweetInput.value){
        renderModal()
        
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

function generateRandomNumber() {
    randomNumber = Math.floor(Math.random() * 100) + 1
    return randomNumber
}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

