#! /bin/bash


git filter-branch -f --env-filter '
OLD_EMAIL="domparso@hotmail.com"			# 原来的邮箱
CORRECT_NAME="Reinering"		# 现在的名字
CORRECT_EMAIL="nbxlhc@hotmail.com"		# 现在的邮箱
if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_COMMITTER_NAME="$CORRECT_NAME"
    export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
fi
if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_AUTHOR_NAME="$CORRECT_NAME"
    export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
fi
' --tag-name-filter cat -- --all

# --branches --tags