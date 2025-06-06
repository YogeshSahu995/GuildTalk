import { ProfileHeader, ProfilePost } from "."

export function Profile({isCurrentUser, profileData}){
    

    return(
        <div className="flex flex-col justify-center items-center px-2 sm:px-3 lg:px-6 xl:px-8">
            <ProfileHeader 
                isCurrentUser={isCurrentUser}
                profileData={profileData} 
            />
            <ProfilePost 
                profileId = {profileData?._id}
                isCurrentUser = {isCurrentUser}
            />
        </div>
    )
}