package service

import (
	"context"
	"next-terminal/server/common"
	"next-terminal/server/model"
	"next-terminal/server/repository"
	"time"
)

var UserPreCmdsService = new(userPreCmdsService)

type userPreCmdsService struct {
	baseService
}

func (service userPreCmdsService) Get(ctx context.Context, id string) ([]model.PreCmd, error) {
	userPreCmds, err := repository.UserPreCmdsRepository.FindById(ctx, id)
	if err != nil {
		return []model.PreCmd{}, err
	}

	return trimUserPreCmds(userPreCmds), err
}

func trimUserPreCmds(cmds []model.UserPreCmds) []model.PreCmd {
	result := make([]model.PreCmd, len(cmds)) // 预分配切片容量
	for i, cmd := range cmds {
		result[i] = model.PreCmd{
			Group: cmd.Group,
			Label: cmd.Label,
			Text:  cmd.Text,
		}
	}
	return result
}

func (service userPreCmdsService) Add(ctx context.Context, id string, item model.PreCmd) error {

	userPreCmds := model.UserPreCmds{
		ID:      id,
		Group:   item.Group,
		Label:   item.Label,
		Text:    item.Text,
		Created: common.NewJsonTime(time.Now()),
	}

	err := repository.UserPreCmdsRepository.Create(ctx, userPreCmds)
	if err != nil {
		return err
	}

	return nil
}

func (service userPreCmdsService) Update(ctx context.Context, id string, items model.PreCmds) error {

	newItem := model.UserPreCmds{
		ID:      id,
		Group:   items.New.Group,
		Label:   items.New.Label,
		Text:    items.New.Text,
		Created: common.NewJsonTime(time.Now()),
	}

	err := repository.UserPreCmdsRepository.Update(ctx, id, items.Old, newItem)
	if err != nil {
		return err
	}

	return nil
}

func (service userPreCmdsService) Delete(ctx context.Context, id string, item model.PreCmd) error {

	userPreCmds := model.UserPreCmds{
		ID:      id,
		Group:   item.Group,
		Label:   item.Label,
		Text:    item.Text,
		Created: common.NewJsonTime(time.Now()),
	}

	err := repository.UserPreCmdsRepository.Delete(ctx, userPreCmds)
	if err != nil {
		return err
	}

	return nil
}

func (service userPreCmdsService) UpdateGroup(ctx context.Context, id string, item model.PreGroup) error {

	err := repository.UserPreCmdsRepository.UpdateGroup(ctx, id, item.Old, item.New)
	if err != nil {
		return err
	}

	return nil
}

func (service userPreCmdsService) DeleteGroup(ctx context.Context, id string, group string) error {

	err := repository.UserPreCmdsRepository.DeleteGroup(ctx, id, group)
	if err != nil {
		return err
	}

	return nil
}
