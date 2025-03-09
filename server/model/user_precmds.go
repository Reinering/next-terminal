package model

import "next-terminal/server/common"

type UserPreCmds struct {
	ID      string          `json:"id"`
	Group   string          `json:"group"`
	Label   string          `json:"label"`
	Text    string          `json:"text"`
	Created common.JsonTime `json:"created"`
}

func (r *UserPreCmds) TableName() string {
	return "user_precmds"
}

type PreCmd struct {
	Group string `json:"group"`
	Label string `json:"label"`
	Text  string `json:"text"`
}

type PreCmds struct {
	Old PreCmd `json:"old"`
	New PreCmd `json:"new"`
}

type PreGroup struct {
	Old string `json:"old"`
	New string `json:"new"`
}
