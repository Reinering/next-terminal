package repository

import (
	"context"
	"next-terminal/server/model"
)

var UserPreCmdsRepository = new(userPreCmdsRepository)

type userPreCmdsRepository struct {
	baseRepository
}

func (r userPreCmdsRepository) FindById(c context.Context, userId string) (o []model.UserPreCmds, err error) {
	err = r.GetDB(c).Where("id = ?", userId).Find(&o).Error
	return
}

func (r userPreCmdsRepository) FindByGroup(c context.Context, userId string, group string) (o []model.UserPreCmds, err error) {
	err = r.GetDB(c).Where("id = ? and group = ?", userId, group).Find(&o).Error
	return
}

func (r userPreCmdsRepository) Create(c context.Context, o model.UserPreCmds) (err error) {
	return r.GetDB(c).Create(o).Error
}

func (r userPreCmdsRepository) Update(c context.Context, id string, old model.PreCmd, item model.UserPreCmds) (err error) {
	return r.GetDB(c).Where("id = ? and `group` = ? and label = ? and text = ? and mark = ?", id, old.Group, old.Label, old.Text, old.Mark).Updates(item).Error
}

func (r userPreCmdsRepository) Delete(c context.Context, item model.UserPreCmds) (err error) {
	return r.GetDB(c).Where("id = ? and `group` = ? and label = ? and text = ? and mark = ?", item.ID, item.Group, item.Label, item.Text, item.Mark).Delete(&model.UserPreCmds{}).Error
}

func (r userPreCmdsRepository) UpdateGroup(c context.Context, id string, old string, newstr string) (err error) {
	sql := "update user_precmds set  `group` = ? where id = ? and `group` = ?"
	return r.GetDB(c).Exec(sql, newstr, id, old).Error
}

func (r userPreCmdsRepository) DeleteGroup(c context.Context, id string, group string) (err error) {
	return r.GetDB(c).Where("id = ? and `group` = ?", id, group).Delete(&model.UserPreCmds{}).Error
}
